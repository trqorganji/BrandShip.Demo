import Foundation
import AVFoundation
import AppKit

// Render the supplied wordmark unchanged, animating only its square i-dot.
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let source = root.appendingPathComponent("public/assets/brandship-logo.png")
let output = root.appendingPathComponent("public/assets/brandship-dot-loop.mp4")
guard !FileManager.default.fileExists(atPath: output.path) else {
    fatalError("Output already exists. Move it aside before regenerating.")
}
let image = NSImage(contentsOf: source)!
let original = image.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let space = CGColorSpaceCreateDeviceRGB()
let logoContext = CGContext(data: nil, width: 658, height: 156, bitsPerComponent: 8,
    bytesPerRow: 658 * 4, space: space, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
logoContext.draw(original, in: CGRect(x: 0, y: 0, width: 658, height: 156))
logoContext.setBlendMode(.sourceIn)
logoContext.setFillColor(CGColor(red: 0, green: 0, blue: 0, alpha: 1))
logoContext.fill(CGRect(x: 0, y: 0, width: 658, height: 156))
let blackLogo = logoContext.makeImage()!
let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: 960, AVVideoHeightKey: 400,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 1_500_000, AVVideoMaxKeyFrameIntervalKey: 60]
])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input,
    sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
        kCVPixelBufferWidthKey as String: 960, kCVPixelBufferHeightKey as String: 400])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
for frame in 0..<240 {
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
    var buffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &buffer)
    let pixel = buffer!
    CVPixelBufferLockBaseAddress(pixel, [])
    let context = CGContext(data: CVPixelBufferGetBaseAddress(pixel), width: 960, height: 400,
        bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixel), space: space,
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    let paper = CGColor(red: 240.0/255, green: 240.0/255, blue: 238.0/255, alpha: 1)
    context.setFillColor(paper)
    context.fill(CGRect(x: 0, y: 0, width: 960, height: 400))
    context.draw(blackLogo, in: CGRect(x: 151, y: 122, width: 658, height: 156))
    context.fill(CGRect(x: 695, y: 243, width: 24, height: 22))
    let t = Double(frame) / 60
    let blue = t < 0.5 ? 0 : t < 0.85 ? (t-0.5)/0.35 : t < 2.3 ? 1 : t < 2.8 ? 1-(t-2.3)/0.5 : 0
    let bounceT = max(0, min(1, (t-0.75)/1.4))
    let bounce = abs(sin(bounceT * .pi * 3)) * 34 * pow(1-bounceT, 1.3)
    context.setFillColor(CGColor(red: 0, green: blue * 163/255, blue: blue, alpha: 1))
    context.fill(CGRect(x: 697, y: 244 + bounce, width: 20, height: 19))
    CVPixelBufferUnlockBaseAddress(pixel, [])
    guard adaptor.append(pixel, withPresentationTime: CMTime(value: Int64(frame), timescale: 60)) else {
        fatalError(writer.error?.localizedDescription ?? "Could not append frame")
    }
}
input.markAsFinished()
let completion = DispatchSemaphore(value: 0)
writer.finishWriting { completion.signal() }
completion.wait()
guard writer.status == .completed else { fatalError(writer.error!.localizedDescription) }
print("Rendered \(output.path)")
